import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class TestLocalTime {
    public static void main(String[] args) {
        try {
            LocalTime time = LocalTime.parse("08:00 AM", DateTimeFormatter.ofPattern("hh:mm a"));
            System.out.println("Success: " + time);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
