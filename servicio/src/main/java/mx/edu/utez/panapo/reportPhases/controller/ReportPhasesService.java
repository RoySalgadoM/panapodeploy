package mx.edu.utez.panapo.reportPhases.controller;

import mx.edu.utez.panapo.project.model.Project;
import mx.edu.utez.panapo.report.model.Report;
import mx.edu.utez.panapo.reportPhases.model.ReportPhases;
import mx.edu.utez.panapo.reportPhases.model.ReportPhasesRepository;
import mx.edu.utez.panapo.utils.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.Optional;

@Service
@Transactional
public class ReportPhasesService {
    @Autowired
    ReportPhasesRepository reportPhasesRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findAll(){
        return  new ResponseEntity<>(new Message("OK",false,reportPhasesRepository.findAll()), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findById(long id){
        if(reportPhasesRepository.existsById(id)){
            return new ResponseEntity<>(new Message("OK", false, reportPhasesRepository.findById(id)), HttpStatus.OK);
        }
        return new ResponseEntity<>(new Message(" no existe", true, reportPhasesRepository.findById(id)), HttpStatus.BAD_REQUEST);
    }

    @Transactional(rollbackFor = {SQLException.class}) // si encuenra un error lo vuelve a hacer
    public ResponseEntity<Message> save(ReportPhases reportPhases){
        Optional<ReportPhases> existsReportPhases = reportPhasesRepository.findById(reportPhases.getId());
        if(existsReportPhases.isPresent()){
            return new ResponseEntity<>(new Message("El Project ya existe", true, null), HttpStatus.BAD_REQUEST);
        }
        ReportPhases savedReportPhases = reportPhasesRepository.saveAndFlush(reportPhases);
        return new ResponseEntity<>(new Message("Project registrada correctamente", false, savedReportPhases), HttpStatus.OK);

    }
}
