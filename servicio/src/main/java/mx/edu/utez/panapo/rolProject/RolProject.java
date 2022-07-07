package mx.edu.utez.panapo.rolProject;

import com.fasterxml.jackson.annotation.JsonIgnore;
import mx.edu.utez.panapo.personTeam.model.PersonTeam;

import javax.persistence.*;
import java.util.List;

@Entity
public class RolProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false, unique = true, length = 20)
    private String description;
    @OneToMany(mappedBy = "rolProject")
    @JsonIgnore
    private List<PersonTeam> personTeamList;

    public RolProject() {
    }

    public RolProject(long id, String description, List<PersonTeam> personTeamList) {
        this.id = id;
        this.description = description;
        this.personTeamList = personTeamList;
    }

    public RolProject(String description, List<PersonTeam> personTeamList) {
        this.description = description;
        this.personTeamList = personTeamList;
    }

    public RolProject(long id, String description) {
        this.id = id;
        this.description = description;
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

    public List<PersonTeam> getPersonTeamList() {
        return personTeamList;
    }

    public void setPersonTeamList(List<PersonTeam> personTeamList) {
        this.personTeamList = personTeamList;
    }
}
