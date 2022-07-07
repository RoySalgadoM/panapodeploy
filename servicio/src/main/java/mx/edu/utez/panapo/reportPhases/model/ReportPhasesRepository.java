package mx.edu.utez.panapo.reportPhases.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface ReportPhasesRepository extends JpaRepository<ReportPhases,Long> {
    boolean existsById(long id);
    Optional<ReportPhases> findByReport_Id(long id);
    Optional<ReportPhases> findById(long id);
 }
