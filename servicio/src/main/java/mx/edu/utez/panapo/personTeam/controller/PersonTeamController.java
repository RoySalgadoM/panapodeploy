package mx.edu.utez.panapo.personTeam.controller;

import mx.edu.utez.panapo.person.controller.PersonDTO;
import mx.edu.utez.panapo.person.model.Person;
import mx.edu.utez.panapo.personTeam.model.PersonTeam;
import mx.edu.utez.panapo.utils.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/personteam")
@CrossOrigin(origins = {"*"})
public class PersonTeamController {
    @Autowired
    PersonTeamService personTeamService;

    @GetMapping("/")
    public ResponseEntity<Message> getAll(){
        return  personTeamService.findAll();
    }

    @GetMapping("/{id}")
    public  ResponseEntity<Message> getById(@PathVariable("id") long id){
        return  personTeamService.findById(id);
    }

    @PostMapping("/")
    public  ResponseEntity<Message> savePersonTeam(@RequestBody PersonTeamDTO personTeamDTO){
        return  personTeamService.save(new PersonTeam(personTeamDTO.getPerson(),personTeamDTO.getRolProject(),personTeamDTO.getProject()));
    }

    @PutMapping("/")
    public ResponseEntity<Message> update(@RequestBody  PersonTeamDTO personTeamDTO){
        return  personTeamService.update(new PersonTeam(personTeamDTO.getId(),personTeamDTO.getPerson(),personTeamDTO.getRolProject(),personTeamDTO.getProject()));
    }


    @DeleteMapping("/{id}")
    public  ResponseEntity<Message> deleteById(@PathVariable("id") long id){
        return  personTeamService.deletebyid(id);
    }

}
