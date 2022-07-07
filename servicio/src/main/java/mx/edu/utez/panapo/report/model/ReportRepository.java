package mx.edu.utez.panapo.report.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    Optional<Report> findByDate(String date);
    Optional<Report> findAllByProject(long id);
    boolean existsById(long id);
    boolean existsByProject(long project);
}
