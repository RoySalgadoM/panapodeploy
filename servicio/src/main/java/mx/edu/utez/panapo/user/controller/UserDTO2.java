package mx.edu.utez.panapo.user.controller;

import mx.edu.utez.panapo.person.model.Person;
import mx.edu.utez.panapo.rol.Rol;
import mx.edu.utez.panapo.status.Status;

import java.util.Set;

public class UserDTO2 {
    private long id;
    private Person person;
    private String username;
    private String password;
    private String code;
    private Set<Rol> authorities;
    private Status status;

    public UserDTO2() {
    }

    public UserDTO2(long id, String password, String code, Person person, Set<Rol> authorities, Status status) {
        this.id = id;
        this.person = person;
        this.password = password;
        this.code = code;
        this.authorities = authorities;
        this.status = status;
        this.username = person.getEmail();
    }

    public UserDTO2(String password, String code, Person person, Set<Rol> authorities, Status status) {
        this.password = password;
        this.person = person;
        this.username = person.getEmail();
        this.code = code;
        this.authorities = authorities;
        this.status = status;
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

    public void setPerson(Person person) {
        this.person = person;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Set<Rol> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Set<Rol> authorities) {
        this.authorities = authorities;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}


