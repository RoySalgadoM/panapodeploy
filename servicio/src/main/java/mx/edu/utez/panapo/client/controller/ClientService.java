package mx.edu.utez.panapo.client.controller;

import mx.edu.utez.panapo.client.model.Client;
import mx.edu.utez.panapo.client.model.ClientRepository;
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
public class ClientService {
    @Autowired
    ClientRepository clientRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findAll(){
        return  new ResponseEntity<>(new Message("OK",false,clientRepository.findAll()), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Message> findById(long id){
        if( clientRepository.existsById(id)){
            return new ResponseEntity<>(new Message("OK", false, clientRepository.findById(id)), HttpStatus.OK);
        }
        return new ResponseEntity<>(new Message("El client no existe", true, clientRepository.findById(id)), HttpStatus.BAD_REQUEST);
    }


    @Transactional(rollbackFor = {SQLException.class}) // si encuenra un error lo vuelve a hacer
    public ResponseEntity<Message> save(Client client){
        Optional<Client> existsCategory = clientRepository.findByCompany(client.getCompany());
        if(existsCategory.isPresent()){
            return new ResponseEntity<>(new Message("El cliente ya existe", true, null), HttpStatus.BAD_REQUEST);
        }
        Client savedClient = clientRepository.saveAndFlush(client);
        return new ResponseEntity<>(new Message("Cliente registrada correctamente", false, savedClient), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class}) // si encuenra un error lo vuelve a hacer
    public ResponseEntity<Message> update(Client client){
        if(clientRepository.existsById(client.getId())){
            return new ResponseEntity<>(new Message("OK", false, clientRepository.saveAndFlush(client)), HttpStatus.OK);
        }
        return new ResponseEntity<>(new Message("El Cliente no existe", true, null), HttpStatus.BAD_REQUEST);
    }
}
