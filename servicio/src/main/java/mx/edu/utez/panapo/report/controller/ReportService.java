package mx.edu.utez.panapo.report.controller;

import mx.edu.utez.panapo.client.model.Client;
import mx.edu.utez.panapo.person.model.Person;
import mx.edu.utez.panapo.phases.Phases;
import mx.edu.utez.panapo.phases.PhasesRepository;
import mx.edu.utez.panapo.project.model.Project;
import mx.edu.utez.panapo.project.model.ProjectRepository;
import mx.edu.utez.panapo.report.model.Report;
import mx.edu.utez.panapo.report.model.ReportRepository;
import mx.edu.utez.panapo.reportPhases.model.ReportPhases;
import mx.edu.utez.panapo.reportPhases.model.ReportPhasesRepository;
import mx.edu.utez.panapo.stages.Stages;
import mx.edu.utez.panapo.stages.StagesRepository;
import mx.edu.utez.panapo.status.Status;
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
public class ReportService {
    @Autowired
    ReportRepository reportRepository;

    @Autowired
    ProjectRepository projectRepository;
    @Autowired
    ReportPhasesRepository reportPhasesRepository;
    @Autowired
    StagesRepository stagesRepository;
    @Autowired
    PhasesRepository phasesRepository;
    @Transactional(readOnly = true)
    public ResponseEntity<Message> findAll(){
        return  new ResponseEntity<>(new Message("OK",false,reportRepository.findAll()), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findById(long id){
        if( reportRepository.existsById(id)){
            return new ResponseEntity<>(new Message("OK", false, reportRepository.findById(id)), HttpStatus.OK);
        }
        return new ResponseEntity<>(new Message("El Reporte no existe", true, reportRepository.findById(id)), HttpStatus.BAD_REQUEST);
    }

    @Transactional(rollbackFor = {SQLException.class}) // si encuenra un error lo vuelve a hacer
    public ResponseEntity<Message> save(Report report){

        Project project = getById(report.getProject().getId()).get();
        project.setPercentage(report.getPercentage());
        project.setDaysDeviation(report.getDaysDeviation());
        Phases phases;
        if(report.getPhaseReal().equals("Inicio")){
            phases = getPhases("Inicio").get();
            project.setPhases(phases);
        }
        if(report.getPhaseReal().equals("Requerimientos")){
            phases = getPhases("Requerimientos").get();
            project.setPhases(phases);
        }
        if(report.getPhaseReal().equals("Análisis y diseño")){
            phases = getPhases("Análisis y diseño").get();
            project.setPhases(phases);
        }
        if(report.getPhaseReal().equals("Construcción")){
            phases = getPhases("Construcción").get();
            project.setPhases(phases);
        }
        if(report.getPhaseReal().equals("Integración y pruebas")){
            phases = getPhases("Integración y pruebas").get();
            project.setPhases(phases);
        }
        if(report.getPhaseReal().equals("Cierre")){
            phases = getPhases("Cierre").get();
            project.setPhases(phases);
        }

        Stages stages;
        if(report.getStageReal().equals("Realización")){
            stages = getStages("Realización").get();
            project.setStages(stages);
        }
        if(report.getStageReal().equals("Planeación")){
            stages = getStages("Planeación").get();
            project.setStages(stages);
        }
        if(report.getStageReal().equals("Control y evaluación")){
            stages = getStages("Control y evaluación").get();
            project.setStages(stages);
        }
        if(report.getStageReal().equals("Cierre")){
            stages = getStages("Cierre").get();
            project.setStages(stages);
        }
        projectRepository.saveAndFlush(project);
        Report savedReport  = reportRepository.saveAndFlush(report);
        return new ResponseEntity<>(new Message("Reporte registrada correctamente", false, savedReport), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class}) // si encuenra un error lo vuelve a hacer
    public ResponseEntity<Message> update(Report report){
        if(reportRepository.existsById(report.getId())){
            return new ResponseEntity<>(new Message("OK", false, reportRepository.saveAndFlush(report)), HttpStatus.OK);
        }
        return new ResponseEntity<>(new Message("El Reporte no existe", true, null), HttpStatus.BAD_REQUEST);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findByProject(long id){
        if( reportRepository.existsByProject(id)){
            return new ResponseEntity<>(new Message("OK", false, reportRepository.findAllByProject(id)), HttpStatus.OK);
        }
        return new ResponseEntity<>(new Message("No existe reporte no existe", true, null), HttpStatus.BAD_REQUEST);
    }


    @Transactional(readOnly = true)
    public Optional<Project> getById(long id){
        return projectRepository.findById(id);
    }
    @Transactional(readOnly = true)
    public Optional<ReportPhases> getbyphasesId(long id){
        return reportPhasesRepository.findByReport_Id(id);
    }

    @Transactional(readOnly = true)
    public  Optional<Stages> getStages(String stages){
        return  stagesRepository.findByDescription(stages);
    }

    @Transactional(readOnly = true)
    public  Optional<Phases> getPhases(String stages){
        return  phasesRepository.findByDescription(stages);
    }
}
