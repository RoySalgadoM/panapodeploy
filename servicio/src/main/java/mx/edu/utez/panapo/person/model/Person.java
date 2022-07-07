package mx.edu.utez.panapo.person.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import mx.edu.utez.panapo.personTeam.model.PersonTeam;
import mx.edu.utez.panapo.profession.Profession;
import mx.edu.utez.panapo.status.Status;
import mx.edu.utez.panapo.user.model.User;
import org.springframework.lang.NonNull;

import javax.persistence.*;
import java.util.List;

@Entity
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false)
    private String name;
    private String surname;
    private String secondSurname;
    @Column(nullable = false)
    private String email;
    private String dateBirth;
    private String phone;
    @ManyToOne
    @JoinColumn(name = "profession_id", nullable = false)
    @NonNull
    private Profession profession;
    @OneToMany(mappedBy = "person")
    @JsonIgnore
    private List<PersonTeam> personTeamList;
    @OneToOne(mappedBy = "person")
    @JsonIgnore
    private User users;
    @ManyToOne
    @JoinColumn(name = "status_id")
    private Status status;

    public Person() {
    }

    public Person(long id, String name, String surname, String secondSurname, String email, String dateBirth, String phone, @NonNull Profession profession, User users, Status status) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.secondSurname = secondSurname;
        this.email = email;
        this.dateBirth = dateBirth;
        this.phone = phone;
        this.profession = profession;
        this.users = users;
        this.status = status;
    }



    public Person(long id, String name, String surname, String secondSurname, String email, String dateBirth, String phone, Profession profession) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.secondSurname = secondSurname;
        this.email = email;
        this.dateBirth = dateBirth;
        this.phone = phone;

        this.profession = profession;
    }

    public Person(long id, String name, String surname, String secondSurname, String email, String dateBirth, String phone, @NonNull Profession profession, Status status) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.secondSurname = secondSurname;
        this.email = email;
        this.dateBirth = dateBirth;
        this.phone = phone;
        this.profession = profession;
        this.status = status;
    }

    public Person(String name, String surname, String secondSurname, String email, String dateBirth, String phone, @NonNull Profession profession) {
        this.name = name;
        this.surname = surname;
        this.secondSurname = secondSurname;
        this.email = email;
        this.dateBirth = dateBirth;
        this.phone = phone;
        this.profession = profession;
    }

    public Person(String name, String surname, String secondSurname, String email, String dateBirth, String phone, @NonNull Profession profession, List<PersonTeam> personTeamList, User users) {
        this.name = name;
        this.surname = surname;
        this.secondSurname = secondSurname;
        this.email = email;
        this.dateBirth = dateBirth;
        this.phone = phone;
        this.profession = profession;
        this.personTeamList = personTeamList;
        this.users = users;
    }

    public Person(long id, String name, String surname, String secondSurname, String email, String dateBirth, String phone, @NonNull Profession profession, List<PersonTeam> personTeamList, User users) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.secondSurname = secondSurname;
        this.email = email;
        this.dateBirth = dateBirth;
        this.phone = phone;
        this.profession = profession;
        this.personTeamList = personTeamList;
        this.users = users;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }



    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getSecondSurname() {
        return secondSurname;
    }

    public void setSecondSurname(String secondSurname) {
        this.secondSurname = secondSurname;
    }

    public List<PersonTeam> getPersonTeamList() {
        return personTeamList;
    }

    public void setPersonTeamList(List<PersonTeam> personTeamList) {
        this.personTeamList = personTeamList;
    }

    public User getUsers() {
        return users;
    }

    public void setUsers(User users) {
        this.users = users;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDateBirth() {
        return dateBirth;
    }

    public void setDateBirth(String dateBirth) {
        this.dateBirth = dateBirth;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    @NonNull
    public Profession getProfession() {
        return profession;
    }

    public void setProfession(@NonNull Profession profession) {
        this.profession = profession;
    }
}
