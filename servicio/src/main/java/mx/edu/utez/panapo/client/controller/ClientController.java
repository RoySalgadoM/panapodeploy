package mx.edu.utez.panapo.client.controller;

import mx.edu.utez.panapo.client.model.Client;
import mx.edu.utez.panapo.utils.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/client")
@CrossOrigin(origins = {"*"})
public class ClientController {
    @Autowired
    ClientService clientService;

    @GetMapping("/")
    public ResponseEntity<Message> getAll(){
        return  clientService.findAll();
    }

    @GetMapping("/{id}")
    public  ResponseEntity<Message> getById(@PathVariable("id") long id){
        return  clientService.findById(id);
    }

    @PostMapping("/")
    public  ResponseEntity<Message> saveClient(@RequestBody ClientDTO clientDTO){
       return  clientService.save(new Client(clientDTO.getName(),clientDTO.getSurname(),clientDTO.getSecondSurname(),clientDTO.getPhoneClient(),clientDTO.getEmailClient(),clientDTO.getCompany(),clientDTO.getEmailRepre(),clientDTO.getNameRepre(),clientDTO.getSurnameRepre(),clientDTO.getSecondSurnameRepre(),clientDTO.getPhoneRepre(),clientDTO.getExtension(),clientDTO.getTypeClient()));
    }

    @PutMapping("/")
    public ResponseEntity<Message> update(@RequestBody ClientDTO clientDTO){
        return clientService.update(new Client(clientDTO.getId(),clientDTO.getName(),clientDTO.getSurname(),clientDTO.getSecondSurname(),clientDTO.getPhoneClient(),clientDTO.getEmailClient(),clientDTO.getCompany(),clientDTO.getEmailRepre(),clientDTO.getNameRepre(),clientDTO.getSurnameRepre(),clientDTO.getSecondSurnameRepre(),clientDTO.getPhoneRepre(),clientDTO.getExtension(),clientDTO.getTypeClient()));
    }
}
