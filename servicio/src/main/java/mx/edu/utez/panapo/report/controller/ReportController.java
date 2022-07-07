package mx.edu.utez.panapo.report.controller;

import mx.edu.utez.panapo.client.controller.ClientDTO;
import mx.edu.utez.panapo.client.model.Client;
import mx.edu.utez.panapo.report.model.Report;
import mx.edu.utez.panapo.utils.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/report")
@CrossOrigin(origins = {"*"})
public class ReportController {
    @Autowired
    ReportService reportService;

    @GetMapping("/")
    public ResponseEntity<Message> getAll(){
        return  reportService.findAll();
    }

    @GetMapping("/{id}")
    public  ResponseEntity<Message> getById(@PathVariable("id") long id){
        return  reportService.findById(id);
    }

    @GetMapping("/report/")
    public  ResponseEntity<Message> getByPorcentage(@PathVariable("id") long id){
        return  reportService.findById(id);
    }

    @PostMapping("/")
    public  ResponseEntity<Message> saveReport(@RequestBody ReportDTO reportDTO){
        return  reportService.save(new Report(reportDTO.getPhasePlanned(),reportDTO.getPhaseReal(),reportDTO.getStagePlanned(),reportDTO.getStageReal(),reportDTO.getCost(),reportDTO.getDaysDeviation(),reportDTO.getDate(),reportDTO.getPercentage(),reportDTO.getProject()));
    }

    @PutMapping("/")
    public ResponseEntity<Message> update(@RequestBody ReportDTO reportDTO){
        return reportService.update(new Report(reportDTO.getId(),reportDTO.getPhasePlanned(),reportDTO.getPhaseReal(),reportDTO.getStagePlanned(),reportDTO.getStageReal(),reportDTO.getCost(),reportDTO.getDaysDeviation(),reportDTO.getDate(),reportDTO.getPercentage(),reportDTO.getProject()));
    }
}
