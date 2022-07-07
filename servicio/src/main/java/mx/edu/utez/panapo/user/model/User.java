package mx.edu.utez.panapo.user.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import mx.edu.utez.panapo.person.model.Person;
import mx.edu.utez.panapo.rol.Rol;
import mx.edu.utez.panapo.status.Status;

import javax.persistence.*;
import java.util.Set;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @JsonIgnore
    private String password;
    @Column( unique = true)
    private String username;
    private String code;
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "person_id")
    private Person person;
    @ManyToOne
    @JoinColumn(name = "status_id", nullable = false)
    private Status status;
    @ManyToMany
    @JoinTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Rol> authorities;

    public User() {
    }

    public User(long id,String password, String code, Person person, Set<Rol> authorities, Status status) {
        this.id = id;
        this.username = person.getEmail();
        this.password = password;
        this.code = code;
        this.person = person;
        this.authorities = authorities;
        this.status = status;
    }

    public User(long id, Person person, Status status, Set<Rol> authorities) {
        this.id = id;

        this.person = person;
        this.status = status;
        this.authorities = authorities;
    }

    public User(long id, Status status) {
        this.id = id;
        this.status = status;
    }

    public User(long id, Set<Rol> authorities) {
        this.id = id;
        this.authorities = authorities;
    }

    public User(long id, String password, Person person, Status status, Set<Rol> authorities) {
        this.id = id;
        this.password = password;
        this.person = person;
        this.status = status;
        this.authorities = authorities;
    }

    public User(long id, String password) {
        this.id = id;
        this.password = password;
    }

    public User(String password, String code) {
        this.password = password;
        this.code = code;
    }

    public User(String password, Person person, Set<Rol> authorities, Status status) {
        this.password = password;
        this.person = person;
        this.authorities = authorities;
        this.status = status;
    }

    public User(long id) {
        this.id = id;
    }

    public User(String username, Set<Rol> authorities) {
        this.username = username;
        this.authorities = authorities;
    }

    public User(String password, Person person, Set<Rol> authorities) {
        this.password = password;
        this.person = person;
        this.authorities = authorities;
    }

    public User(String password, Person person, Status status, Set<Rol> authorities) {
        this.password = password;
        this.person = person;
        this.status = status;
        this.authorities = authorities;
    }

    public User(String password, String username, String code, Person person, Status status, Set<Rol> authorities) {
        this.password = password;
        this.username = username;
        this.code = code;
        this.person = person;
        this.status = status;
        this.authorities = authorities;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public Set<Rol> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Set<Rol> authorities) {
        this.authorities = authorities;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
