package mx.edu.utez.panapo.profession;

import com.fasterxml.jackson.annotation.JsonIgnore;
import mx.edu.utez.panapo.person.model.Person;

import javax.persistence.*;
import java.util.List;

@Entity
public class Profession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false, unique = true, length = 20)
    private String description;
    @OneToMany(mappedBy = "profession")
    @JsonIgnore
    private List<Person> personList;

    public Profession() {
    }

    public Profession(long id, String description, List<Person> personList) {
        this.id = id;
        this.description = description;
        this.personList = personList;
    }

    public Profession(long id, String description) {
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

    public List<Person> getPersonList() {
        return personList;
    }

    public void setPersonList(List<Person> personList) {
        this.personList = personList;
    }
}
