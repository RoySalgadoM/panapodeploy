package mx.edu.utez.panapo.personTeam.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface PersonTeamRepository extends JpaRepository<PersonTeam, Long> {
    boolean existsById(long id);
    boolean existsByProject_Id(long id);
    Optional<PersonTeam> findByProject(long id);
    Optional<PersonTeam> findByPerson_Id(long id);
    void  deleteByProject_Id(long id);
}
