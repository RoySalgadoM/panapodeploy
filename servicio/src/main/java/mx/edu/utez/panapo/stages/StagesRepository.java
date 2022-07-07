package mx.edu.utez.panapo.stages;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StagesRepository extends JpaRepository<Stages, Long> {
    boolean existsById(long id);
    Optional<Stages> findByDescription(String stages);
}
