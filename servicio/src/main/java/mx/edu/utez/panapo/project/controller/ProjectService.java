package mx.edu.utez.panapo.project.controller;

import mx.edu.utez.panapo.person.model.Person;
import mx.edu.utez.panapo.project.model.Project;
import mx.edu.utez.panapo.project.model.ProjectRepository;
import mx.edu.utez.panapo.user.model.User;
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
public class ProjectService {
    @Autowired
    ProjectRepository projectRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findAll(){
        return  new ResponseEntity<>(new Message("OK",false,projectRepository.findAll()), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findById(long id){
        if(projectRepository.existsById(id)){
            return new ResponseEntity<>(new Message("OK", false, projectRepository.findById(id)), HttpStatus.OK);
        }
        return new ResponseEntity<>(new Message("El Project no existe", true, projectRepository.findById(id)), HttpStatus.BAD_REQUEST);
    }

    @Transactional(rollbackFor = {SQLException.class}) // si encuenra un error lo vuelve a hacer
    public ResponseEntity<Message> save(Project project){
        Optional<Project> existsProject = projectRepository.findByAcronym(project.getAcronym());
        if(existsProject.isPresent()){
            return new ResponseEntity<>(new Message("El Project ya existe", true, null), HttpStatus.BAD_REQUEST);
        }
        Project savedProject = projectRepository.saveAndFlush(project);
        return new ResponseEntity<>(new Message("Project registrada correctamente", false, savedProject), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class}) // si encuenra un error lo vuelve a hacer
    public ResponseEntity<Message> save2(Project project){
        Optional<Project> existsProject = projectRepository.findByName(project.getName());
        if(existsProject.isPresent()){
            return new ResponseEntity<>(new Message("El Project ya existe", true, null), HttpStatus.BAD_REQUEST);
        }
        Project savedProject = projectRepository.saveAndFlush(project);
        return new ResponseEntity<>(new Message("Project registrada correctamente", false, savedProject), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class}) // si encuenra un error lo vuelve a hacer
    public ResponseEntity<Message> update(Project project){
        if(projectRepository.existsById(project.getId())){
            return new ResponseEntity<>(new Message("OK", false, projectRepository.saveAndFlush(project)), HttpStatus.OK);
        }
        return new ResponseEntity<>(new Message("El Project no existe", true, null), HttpStatus.BAD_REQUEST);
    }

    @Transactional(rollbackFor = {SQLException.class}) // si encuenra un error lo vuelve a hacer
    public ResponseEntity<Message> update2(Project project){
        if(projectRepository.existsById(project.getId())){
            Project project1 = getById(project.getId()).get();
            project1.setStatusProject(project.getStatusProject());
            project1.setPriority(project.getPriority());
            return new ResponseEntity<>(new Message("OK", false, projectRepository.saveAndFlush(project1)), HttpStatus.OK);
        }
        return new ResponseEntity<>(new Message("El Project no existe", true, null), HttpStatus.BAD_REQUEST);
    }

    @Transactional(readOnly = true)
    public Optional<Project> getById(long id){
        return projectRepository.findById(id);
    }

}
