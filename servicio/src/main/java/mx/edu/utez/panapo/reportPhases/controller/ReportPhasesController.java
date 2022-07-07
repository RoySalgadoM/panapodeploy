package mx.edu.utez.panapo.reportPhases.controller;

import mx.edu.utez.panapo.project.controller.ProjectDTO;
import mx.edu.utez.panapo.project.model.Project;
import mx.edu.utez.panapo.reportPhases.model.ReportPhases;
import mx.edu.utez.panapo.utils.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reportphases")
@CrossOrigin(origins = {"*"})
public class ReportPhasesController {
    @Autowired
    ReportPhasesService reportPhasesService;
    @GetMapping("/")
    public ResponseEntity<Message> getAll(){
        return  reportPhasesService.findAll();
    }

    @GetMapping("/{id}")
    public  ResponseEntity<Message> getById(@PathVariable("id") long id){
        return  reportPhasesService.findById(id);
    }

    @PostMapping("/")
    public  ResponseEntity<Message> saveClient(@RequestBody ReportPhasesDTO reportPhasesDTO){
        return  reportPhasesService.save(new ReportPhases(reportPhasesDTO.getPhases(),reportPhasesDTO.getReport(),reportPhasesDTO.getPorcentaje()));
    }
}
