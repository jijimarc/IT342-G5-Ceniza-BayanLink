package edu.cit.ceniza.bayanlink.config;

import edu.cit.ceniza.bayanlink.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * DECORATOR PATTERN IMPLEMENTATION
 * * Base Component: The standard HTTP request processing chain (FilterChain).
 * Decorator: This JwtAuthenticationFilter class.
 * * Purpose: Dynamically adds security verification behavior to incoming requests
 * before delegating the execution back to the standard processing chain.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. ADDED BEHAVIOR (The "Decoration")
        // We add new logic that the base request doesn't natively have: checking for JWTs.
        String authHeader = request.getHeader("Authorization");
        System.out.println("Processing Request: " + request.getRequestURI());

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String userEmail = jwtService.extractEmail(token);
                System.out.println("Token Valid. User: " + userEmail);

                // Adding security context state to this specific request thread
                if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userEmail, null, Collections.emptyList()
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
                System.out.println("ERROR Validating Token: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("No Bearer Header found!");
        }

        // 2. DELEGATION (Passing control back to the wrapped component)
        // Regardless of what our decorator did above, we now pass the request
        // down the chain so the original intended target (e.g., the Controller) can run.
        filterChain.doFilter(request, response);
    }
}