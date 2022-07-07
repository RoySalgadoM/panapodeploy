package mx.edu.utez.panapo.status;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository

public interface StatusRepository extends JpaRepository<Status,Long> {
    Optional<Status> findById(long id);
}
