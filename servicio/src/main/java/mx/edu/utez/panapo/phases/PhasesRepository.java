package mx.edu.utez.panapo.phases;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PhasesRepository extends JpaRepository<Phases,Long> {
    boolean existsById(long id);
    Optional<Phases> findByDescription(String phases);
}


