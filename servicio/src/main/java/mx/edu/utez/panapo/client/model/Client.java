package mx.edu.utez.panapo.client.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import mx.edu.utez.panapo.project.model.Project;
import mx.edu.utez.panapo.type_client.TypeClient;
import org.springframework.lang.NonNull;

import javax.persistence.*;
import java.util.List;

@Entity
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false)
    private String name;
    private String surname;
    private String secondSurname;
    private String phoneClient;
    private String emailClient;
    @Column(nullable = false)
    private String company;
    @Column(nullable = false)
    private String emailRepre;
    private String nameRepre;
    private String surnameRepre;
    private String secondSurnameRepre;
    private String phoneRepre;
    private String extension;
    @ManyToOne
    @JoinColumn(name = "typeclient_id", nullable = false)
    @NonNull
    private TypeClient typeClient;
    @OneToMany(mappedBy = "client")
    @JsonIgnore
    private List<Project> projectList;

    public Client() {
    }

    public Client(long id, String name, String surname, String secondSurname, String phoneClient, String emailClient, String company, String emailRepre, String nameRepre, String surnameRepre, String secondSurnameRepre, String phoneRepre,String extension, @NonNull TypeClient typeClient) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.secondSurname = secondSurname;
        this.phoneClient = phoneClient;
        this.emailClient = emailClient;
        this.company = company;
        this.emailRepre = emailRepre;
        this.nameRepre = nameRepre;
        this.surnameRepre = surnameRepre;
        this.secondSurnameRepre = secondSurnameRepre;
        this.phoneRepre = phoneRepre;
        this.extension = extension;
        this.typeClient = typeClient;
    }

    public Client(String name, String surname, String secondSurname, String phoneClient, String emailClient, String company, String emailRepre, String nameRepre, String surnameRepre, String secondSurnameRepre, String phoneRepre,String extension, @NonNull TypeClient typeClient) {
        this.name = name;
        this.surname = surname;
        this.secondSurname = secondSurname;
        this.phoneClient = phoneClient;
        this.emailClient = emailClient;
        this.company = company;
        this.emailRepre = emailRepre;
        this.nameRepre = nameRepre;
        this.surnameRepre = surnameRepre;
        this.secondSurnameRepre = secondSurnameRepre;
        this.phoneRepre = phoneRepre;
        this.extension = extension;
        this.typeClient = typeClient;
    }

    public String getExtension() {
        return extension;
    }

    public void setExtension(String extension) {
        this.extension = extension;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getEmailClient() {
        return emailClient;
    }

    public void setEmailClient(String emailClient) {
        this.emailClient = emailClient;
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

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getEmailRepre() {
        return emailRepre;
    }

    public void setEmailRepre(String emailRepre) {
        this.emailRepre = emailRepre;
    }

    public String getNameRepre() {
        return nameRepre;
    }

    public void setNameRepre(String nameRepre) {
        this.nameRepre = nameRepre;
    }

    public String getPhoneClient() {
        return phoneClient;
    }

    public void setPhoneClient(String phoneClient) {
        this.phoneClient = phoneClient;
    }

    public String getSurnameRepre() {
        return surnameRepre;
    }

    public void setSurnameRepre(String surnameRepre) {
        this.surnameRepre = surnameRepre;
    }

    public String getSecondSurnameRepre() {
        return secondSurnameRepre;
    }

    public void setSecondSurnameRepre(String secondSurnameRepre) {
        this.secondSurnameRepre = secondSurnameRepre;
    }

    public String getPhoneRepre() {
        return phoneRepre;
    }

    public void setPhoneRepre(String phoneRepre) {
        this.phoneRepre = phoneRepre;
    }

    @NonNull
    public TypeClient getTypeClient() {
        return typeClient;
    }

    public void setTypeClient(@NonNull TypeClient typeClient) {
        this.typeClient = typeClient;
    }

    public List<Project> getProjectList() {
        return projectList;
    }

    public void setProjectList(List<Project> projectList) {
        this.projectList = projectList;
    }
}

