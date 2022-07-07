package mx.edu.utez.panapo.rolProject;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolProjectRepository extends JpaRepository<RolProject, Long> {
}
