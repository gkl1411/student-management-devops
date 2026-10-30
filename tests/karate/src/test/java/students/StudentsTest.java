package students;

import com.intuit.karate.junit5.Karate;

class StudentsTest {

    @Karate.Test
    Karate testStudents() {
        return Karate.run("students").relativeTo(getClass());
    }
}
