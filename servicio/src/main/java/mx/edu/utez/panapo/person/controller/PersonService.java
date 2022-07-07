package mx.edu.utez.panapo.person.controller;

import mx.edu.utez.panapo.person.model.Person;
import mx.edu.utez.panapo.person.model.PersonRepository;
import mx.edu.utez.panapo.status.Status;
import mx.edu.utez.panapo.status.StatusRepository;
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
public class PersonService {
    @Autowired
    PersonRepository personRepository;
    @Autowired
    StatusRepository statusRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findAll(){
        return  new ResponseEntity<>(new Message("OK",false,personRepository.findAll()), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findById(long id){
        if(personRepository.existsById(id)){
            return new ResponseEntity<>(new Message("OK", false, personRepository.findById(id)), HttpStatus.OK);
        }
        return new ResponseEntity<>(new Message("El Persona no existe", true, personRepository.findById(id)), HttpStatus.BAD_REQUEST);
    }


    @Transactional(rollbackFor = {SQLException.class}) // si encuenra un error lo vuelve a hacer
    public ResponseEntity<Message> save(Person person){
        Optional<Person> existsPerson = personRepository.findByEmail(person.getEmail());
        if(existsPerson.isPresent()){
            return new ResponseEntity<>(new Message("El Persona ya existe", true, null), HttpStatus.BAD_REQUEST);
        }
        person.setStatus(getByStatus(1).get());
        Person savedPerson = personRepository.saveAndFlush(person);
        return new ResponseEntity<>(new Message("Persona registrada correctamente", false, savedPerson), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class}) // si encuenra un error lo vuelve a hacer
    public ResponseEntity<Message> update(Person person){
        if(personRepository.existsById(person.getId())){
            return new ResponseEntity<>(new Message("OK", false, personRepository.saveAndFlush(person)), HttpStatus.OK);
        }
        return new ResponseEntity<>(new Message("El Persona no existe", true, null), HttpStatus.BAD_REQUEST);
    }

    @Transactional(readOnly = true)
    public Optional<Status> getByStatus(long id){
        return statusRepository.findById(id);
    }

}
