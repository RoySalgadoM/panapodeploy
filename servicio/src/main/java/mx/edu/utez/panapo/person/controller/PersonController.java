package mx.edu.utez.panapo.person.controller;

import mx.edu.utez.panapo.person.model.Person;
import mx.edu.utez.panapo.utils.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/person")
@CrossOrigin(origins = {"*"})
public class PersonController {
    @Autowired
    PersonService personService;

    @GetMapping("/")
    public ResponseEntity<Message> getAll(){
        return  personService.findAll();
    }

    @GetMapping("/{id}")
    public  ResponseEntity<Message> getById(@PathVariable("id") long id){
        return  personService.findById(id);
    }

    @PostMapping("/")
    public  ResponseEntity<Message> saveClient(@RequestBody PersonDTO personDTO){
        return  personService.save(new Person(personDTO.getName(),personDTO.getSurname(), personDTO.getSecondSurname(), personDTO.getEmail(),personDTO.getDateBirth(),personDTO.getPhone(),personDTO.getProfession()));
    }

    @PutMapping("/")
    public ResponseEntity<Message> update(@RequestBody PersonDTO personDTO){
        return personService.update(new Person(personDTO.getId(),personDTO.getName(),personDTO.getSurname(), personDTO.getSecondSurname(),personDTO.getEmail(),personDTO.getDateBirth(),personDTO.getPhone(),personDTO.getProfession(),personDTO.getStatus()));
    }


}
