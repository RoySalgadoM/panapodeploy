package mx.edu.utez.panapo.personTeam.controller;

import mx.edu.utez.panapo.person.model.Person;
import mx.edu.utez.panapo.project.model.Project;
import mx.edu.utez.panapo.rolProject.RolProject;

public class PersonTeamDTO {
    private long id;
    private Person person;
    private Project project;
    private RolProject rolProject;


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public RolProject getRolProject() {
        return rolProject;
    }

    public void setRolProject(RolProject rolProject) {
        this.rolProject = rolProject;
    }
}
