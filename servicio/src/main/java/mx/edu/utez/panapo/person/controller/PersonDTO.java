package mx.edu.utez.panapo.person.controller;

import mx.edu.utez.panapo.profession.Profession;
import mx.edu.utez.panapo.status.Status;

public class PersonDTO {
    private long id;
    private String name;
    private String surname;
    private String secondSurname;
    private String email;
    private String dateBirth;
    private String phone;
    private Profession profession;
    private Status status;
    public PersonDTO() {
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public PersonDTO(long id, String name, String surname, String secondSurname, String email, String dateBirth, String phone, Profession profession) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.secondSurname = secondSurname;
        this.email = email;
        this.dateBirth = dateBirth;
        this.phone = phone;
        this.profession = profession;
    }

    public PersonDTO(String name, String surname, String secondSurname, String email, String dateBirth, String phone, Profession profession) {
        this.name = name;
        this.surname = surname;
        this.secondSurname = secondSurname;
        this.email = email;
        this.dateBirth = dateBirth;
        this.phone = phone;
        this.profession = profession;
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

    public Profession getProfession() {
        return profession;
    }

    public void setProfession(Profession profession) {
        this.profession = profession;
    }
}
