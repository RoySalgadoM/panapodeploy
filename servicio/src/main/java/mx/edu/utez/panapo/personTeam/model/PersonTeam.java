package mx.edu.utez.panapo.personTeam.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import mx.edu.utez.panapo.person.model.Person;
import mx.edu.utez.panapo.project.model.Project;
import mx.edu.utez.panapo.rolProject.RolProject;
import org.springframework.lang.NonNull;

import javax.persistence.*;

@Entity
public class PersonTeam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    @NonNull
    private Person person;
    @ManyToOne
    @JoinColumn(name = "project_id" )
    @JsonIgnore
    private Project project;
    @ManyToOne
    @JoinColumn(name = "rolProject_id", nullable = false)
    @NonNull
    private RolProject rolProject;

    public PersonTeam() {
    }

    public PersonTeam(Person person, RolProject rolProject, Project project) {
        this.person = person;
        this.rolProject = rolProject;
        this.project = project;
    }

    public PersonTeam(long id,  Person person, RolProject rolProject, Project project) {
        this.id = id;
        this.person = person;
        this.rolProject = rolProject;
        this.project = project;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson( Person person) {
        this.person = person;
    }

    public RolProject getRolProject() {
        return rolProject;
    }

    public void setRolProject( RolProject rolProject) {
        this.rolProject = rolProject;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project team) {
        this.project = team;
    }
}
