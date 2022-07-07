package mx.edu.utez.panapo.phases;

import com.fasterxml.jackson.annotation.JsonIgnore;
import mx.edu.utez.panapo.project.model.Project;
import mx.edu.utez.panapo.report.model.Report;
import mx.edu.utez.panapo.reportPhases.model.ReportPhases;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Entity
public class Phases {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false, unique = true, length = 40)
    private String description;
    @OneToMany(mappedBy = "phases")
    @JsonIgnore
    private List<Project> projectList;
    @OneToMany(mappedBy = "phases")
    @JsonIgnore
    private List<ReportPhases> reportPhasesList;

    public Phases() {
    }

    public Phases(long id, String description) {
        this.id = id;
        this.description = description;
    }

    public Phases(long id, String description, List<Project> projectList, Set<Report> reports) {
        this.id = id;
        this.description = description;
        this.projectList = projectList;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Project> getProjectList() {
        return projectList;
    }

    public void setProjectList(List<Project> projectList) {
        this.projectList = projectList;
    }

}
