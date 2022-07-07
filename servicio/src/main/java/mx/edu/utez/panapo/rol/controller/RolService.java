package mx.edu.utez.panapo.rol.controller;


import mx.edu.utez.panapo.project.model.Project;
import mx.edu.utez.panapo.project.model.ProjectRepository;
import mx.edu.utez.panapo.rol.Rol;
import mx.edu.utez.panapo.rol.RolRepository;
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
public class RolService {
    @Autowired
    RolRepository rolRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findAll(){
        return  new ResponseEntity<>(new Message("OK",false,rolRepository.findAll()), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findById(long id){
        if(rolRepository.existsById(id)){
            return new ResponseEntity<>(new Message("OK", false, rolRepository.findById(id)), HttpStatus.OK);
        }
        return new ResponseEntity<>(new Message("El Rol no existe", true, rolRepository.findById(id)), HttpStatus.BAD_REQUEST);
    }
    @Transactional(rollbackFor = {SQLException.class}) // si encuenra un error lo vuelve a hacer
    public ResponseEntity<Message> save(Rol rol){
        Optional<Rol> existsRol = rolRepository.findByDescription(rol.getDescription());
        if(existsRol.isPresent()){
            return new ResponseEntity<>(new Message("El Rol ya existe", true, null), HttpStatus.BAD_REQUEST);
        }
        Rol savedrol = rolRepository.saveAndFlush(rol);
        return new ResponseEntity<>(new Message("Rol registrada correctamente", false, savedrol), HttpStatus.OK);
    }


    @Transactional(rollbackFor = {SQLException.class}) // si encuenra un error lo vuelve a hacer
    public ResponseEntity<Message> update(Rol rol){
        if(rolRepository.existsById(rol.getId())){
            return new ResponseEntity<>(new Message("OK", false, rolRepository.saveAndFlush(rol)), HttpStatus.OK);
        }
        return new ResponseEntity<>(new Message("El Project no existe", true, null), HttpStatus.BAD_REQUEST);
    }
}
