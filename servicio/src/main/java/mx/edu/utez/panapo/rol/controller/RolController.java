package mx.edu.utez.panapo.rol.controller;

import mx.edu.utez.panapo.project.controller.ProjectDTO;
import mx.edu.utez.panapo.project.controller.ProjectService;
import mx.edu.utez.panapo.project.model.Project;
import mx.edu.utez.panapo.rol.Rol;
import mx.edu.utez.panapo.utils.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rol")
@CrossOrigin(origins = {"*"})
public class RolController {
    @Autowired
    RolService rolService;
    @GetMapping("/")
    public ResponseEntity<Message> getAll(){
        return  rolService.findAll();
    }

    @GetMapping("/{id}")
    public  ResponseEntity<Message> getById(@PathVariable("id") long id){
        return  rolService.findById(id);
    }
    @PostMapping("/")
    public  ResponseEntity<Message> save(@RequestBody RolDTO rolDTO){
        return  rolService.save(new Rol(rolDTO.getAcronym(),rolDTO.getDescription()));
    }

    @PutMapping("/")
    public  ResponseEntity<Message> update(@RequestBody RolDTO rolDTO){
        return  rolService.update(new Rol(rolDTO.getId(),rolDTO.getAcronym(),rolDTO.getDescription()));
    }

}
