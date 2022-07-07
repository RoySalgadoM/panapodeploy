package mx.edu.utez.panapo.rol;

import com.fasterxml.jackson.annotation.JsonIgnore;
import mx.edu.utez.panapo.user.model.User;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Entity
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false,unique = true, length = 20)
    private String acronym;
    @Column(nullable = false, unique = true, length = 80)
    private String description;
    @ManyToMany(mappedBy = "authorities")
    @JsonIgnore
    private Set<User> users;

    public Rol() {
    }

    public Rol(long id, String acronym, String description) {
        this.id = id;
        this.acronym = acronym;
        this.description = description;
    }

    public Rol(String acronym, String description) {
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
