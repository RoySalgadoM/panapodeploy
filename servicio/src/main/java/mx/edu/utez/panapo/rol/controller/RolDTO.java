package mx.edu.utez.panapo.rol.controller;

import mx.edu.utez.panapo.user.model.User;

import java.util.Set;

public class RolDTO {
    private long id;
    private String acronym;
    private String description;
    private Set<User> users;

    public RolDTO() {
    }

    public RolDTO(long id, String acronym, String description) {
        this.id = id;
        this.acronym = acronym;
        this.description = description;
    }

    public RolDTO(String acronym, String description) {
        this.acronym = acronym;
        this.description = description;
    }

    public String getAcronym() {
        return acronym;
    }

    public void setAcronym(String acronym) {
        this.acronym = acronym;
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

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }
}

