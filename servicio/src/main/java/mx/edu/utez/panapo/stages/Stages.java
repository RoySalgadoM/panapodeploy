package mx.edu.utez.panapo.stages;

import com.fasterxml.jackson.annotation.JsonIgnore;
import mx.edu.utez.panapo.project.model.Project;

import javax.persistence.*;
import java.util.List;

@Entity
public class Stages {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false, unique = true, length = 20)
    private String description;
    @OneToMany(mappedBy = "stages")
    @JsonIgnore
    private List<Project> projectList;

    public Stages() {
    }

    public Stages(long id, String description) {
        this.id = id;
        this.description = description;
    }

    public Stages(long id, String description, List<Project> projectList) {
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

