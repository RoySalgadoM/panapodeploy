package mx.edu.utez.panapo.user.model;
import mx.edu.utez.panapo.person.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository

public interface UserRepository  extends JpaRepository<User,Long> {
    boolean existsByPersonEmail(String email);
    Optional<User> findByUsername (String username);
    Optional<User> findByCode(String code);
    Optional<User> findById(long id);
    Optional<User> findByPerson_Email(String email);
    void removeById(long id);
    void deleteById(long id);
    boolean existsByUsername(String username);
    boolean existsById(long id);
    boolean existsByCode(String code);
}
