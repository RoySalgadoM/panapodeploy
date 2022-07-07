package mx.edu.utez.panapo.project.controller;

import mx.edu.utez.panapo.person.controller.PersonDTO;
import mx.edu.utez.panapo.person.model.Person;
import mx.edu.utez.panapo.project.model.Project;
import mx.edu.utez.panapo.project.model.ProjectRepository;
import mx.edu.utez.panapo.utils.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
    @RequestMapping("/api/project")
@CrossOrigin(origins = {"*"})
public class ProjectController {
    @Autowired
    ProjectService projectService;
    @GetMapping("/")
    public ResponseEntity<Message> getAll(){
        return  projectService.findAll();
    }

    @GetMapping("/{id}")
    public  ResponseEntity<Message> getById(@PathVariable("id") long id){
        return  projectService.findById(id);
    }

    @PostMapping("/")
    public  ResponseEntity<Message> saveClient(@RequestBody ProjectDTO projectDTO){
        return  projectService.save2(new Project(projectDTO.getName(),projectDTO.getDescription(),projectDTO.getCotizacion(),projectDTO.getMonths(),projectDTO.getNumberBeca(),projectDTO.getPriceClient(),projectDTO.getClient(),projectDTO.getStatusProject()));
    }

    @PutMapping("/")
    public ResponseEntity<Message> update(@RequestBody ProjectDTO projectDTO){
        return projectService.update(new Project(projectDTO.getId(),projectDTO.getName(),projectDTO.getDescription(),projectDTO.getDateStart(),projectDTO.getDateEnd(),projectDTO.getCotizacion(),projectDTO.getMonths(),projectDTO.getNumberBeca(),projectDTO.getPriceClient(),projectDTO.getAcronym(),projectDTO.getPriority(),projectDTO.getPersonTeam(),projectDTO.getPhases(), projectDTO.getStages(), projectDTO.getClient(), projectDTO.getStatusProject(), projectDTO.getProject()));
    }

    @PutMapping("/update")
    public ResponseEntity<Message> update2(@RequestBody ProjectDTO projectDTO){
        return projectService.update2(new Project(projectDTO.getId(),projectDTO.getPriority(),projectDTO.getStatusProject()));
    }

    @PutMapping("/prospetos")
    public ResponseEntity<Message> updateProspestos(@RequestBody ProjectDTO projectDTO){
        return  projectService.save2(new Project(projectDTO.getId(),projectDTO.getName(),projectDTO.getDescription(),projectDTO.getCotizacion(),projectDTO.getMonths(),projectDTO.getNumberBeca(),projectDTO.getPriceClient(),projectDTO.getClient(),projectDTO.getStatusProject()));
    }

}
