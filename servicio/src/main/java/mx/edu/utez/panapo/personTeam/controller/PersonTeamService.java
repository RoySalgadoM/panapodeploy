package mx.edu.utez.panapo.personTeam.controller;


import mx.edu.utez.panapo.personTeam.model.PersonTeam;
import mx.edu.utez.panapo.personTeam.model.PersonTeamRepository;
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
public class PersonTeamService {
    @Autowired
    PersonTeamRepository   personTeamRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findAll(){
        return  new ResponseEntity<>(new Message("OK",false,personTeamRepository.findAll()), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findById(long id){
        if(personTeamRepository.existsById(id)){
            return new ResponseEntity<>(new Message("OK", false, personTeamRepository.findById(id)), HttpStatus.OK);
        }
        return new ResponseEntity<>(new Message("El Persona no existe", true, personTeamRepository.findById(id)), HttpStatus.BAD_REQUEST);
    }

    @Transactional(rollbackFor = {SQLException.class}) // si encuenra un error lo vuelve a hacer
    public ResponseEntity<Message> save(PersonTeam personTeam){

        PersonTeam saved = personTeamRepository.saveAndFlush(personTeam);
        return new ResponseEntity<>(new Message("Persona registrada correctamente", false, saved), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class}) // si encuenra un error lo vuelve a hacer
    public ResponseEntity<Message> update(PersonTeam personTeam){
        if(personTeamRepository.existsById(personTeam.getId())){
            return new ResponseEntity<>(new Message("OK", false, personTeamRepository.saveAndFlush(personTeam)), HttpStatus.OK);
        }
        return new ResponseEntity<>(new Message("El Persona no existe", true, null), HttpStatus.BAD_REQUEST);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Message> deletebyid(long id){
        if(personTeamRepository.existsByProject_Id(id)){
            System.out.println(id);
            personTeamRepository.deleteByProject_Id(id);
            return new ResponseEntity<>(new Message("Persona eliminado", false,null), HttpStatus.OK);
        }
        return new ResponseEntity<>(new Message("El Persona no existe", true, null), HttpStatus.BAD_REQUEST);
    }

    @Transactional(readOnly = true)
    public Optional<PersonTeam> getById(long id){
        return personTeamRepository.findByProject(id);
    }


}
