package mx.edu.utez.panapo.person.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonRepository  extends JpaRepository<Person, Long> {
    Optional<Person> findByEmail(String email);
    Optional<Person> findById(long id);
    void deleteByEmail(String email);
    boolean existsById(long id);
    boolean existsByEmail(String email);
}
