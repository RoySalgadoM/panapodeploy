package mx.edu.utez.panapo.project.controller;

import mx.edu.utez.panapo.StatusProject.StatusProject;
import mx.edu.utez.panapo.client.model.Client;
import mx.edu.utez.panapo.personTeam.model.PersonTeam;
import mx.edu.utez.panapo.phases.Phases;
import mx.edu.utez.panapo.project.model.Project;
import mx.edu.utez.panapo.stages.Stages;

import java.util.List;

public class ProjectDTO {
    private long id;
    private String name;
    private String description;
    private String dateStart;
    private String dateEnd;
    private String cotizacion;
    private String months;
    private String numberBeca;
    private String priceClient;
    private int percentage;
    private String daysDeviation;

    public int getPercentage() {
        return percentage;
    }

    public void setPercentage(int percentage) {
        this.percentage = percentage;
    }

    public String getDaysDeviation() {
        return daysDeviation;
    }

    public void setDaysDeviation(String daysDeviation) {
        this.daysDeviation = daysDeviation;
    }

    private String acronym;
    private String priority;
    private List<PersonTeam> personTeam;
    private Phases phases;
    private Stages stages;
    private Client client;
    private StatusProject statusProject;
    private Project project;

    public ProjectDTO() {
    }

    public ProjectDTO(String name, String description, String dateStart, String dateEnd, String cotizacion, String months, String numberBeca, String acronym, String priority, List<PersonTeam> personTeam, Phases phases, Stages stages, Client client, StatusProject statusProject, Project project) {
        this.name = name;
        this.description = description;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
        this.cotizacion = cotizacion;
        this.months = months;
        this.numberBeca = numberBeca;
        this.acronym = acronym;
        this.priority = priority;
        this.personTeam = personTeam;
        this.phases = phases;
        this.stages = stages;
        this.client = client;
        this.statusProject = statusProject;
        this.project = project;
    }

    public ProjectDTO(long id, String name, String description, String dateStart, String dateEnd, String cotizacion, String months, String numberBeca, String acronym, String priority, List<PersonTeam> personTeam, Phases phases, Stages stages, Client client, StatusProject statusProject, Project project) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
        this.cotizacion = cotizacion;
        this.months = months;
        this.numberBeca = numberBeca;
        this.acronym = acronym;
        this.priority = priority;
        this.personTeam = personTeam;
        this.phases = phases;
        this.stages = stages;
        this.client = client;
        this.statusProject = statusProject;
        this.project = project;
    }

    public String getPriceClient() {
        return priceClient;
    }

    public void setPriceClient(String priceClient) {
        this.priceClient = priceClient;
    }

    public List<PersonTeam> getPersonTeam() {
        return personTeam;
    }

    public void setPersonTeam(List<PersonTeam> personTeam) {
        this.personTeam = personTeam;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDateStart() {
        return dateStart;
    }

    public void setDateStart(String dateStart) {
        this.dateStart = dateStart;
    }

    public String getDateEnd() {
        return dateEnd;
    }

    public void setDateEnd(String dateEnd) {
        this.dateEnd = dateEnd;
    }

    public String getCotizacion() {
        return cotizacion;
    }

    public void setCotizacion(String cotizacion) {
        this.cotizacion = cotizacion;
    }

    public String getMonths() {
        return months;
    }

    public void setMonths(String months) {
        this.months = months;
    }

    public String getNumberBeca() {
        return numberBeca;
    }

    public void setNumberBeca(String numberBeca) {
        this.numberBeca = numberBeca;
    }

    public String getAcronym() {
        return acronym;
    }

    public void setAcronym(String acronym) {
        this.acronym = acronym;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public List<PersonTeam> getTeam() {
        return personTeam;
    }

    public void setTeam(List<PersonTeam> personTeam) {
        this.personTeam = personTeam;
    }

    public Phases getPhases() {
        return phases;
    }

    public void setPhases(Phases phases) {
        this.phases = phases;
    }

    public Stages getStages() {
        return stages;
    }

    public void setStages(Stages stages) {
        this.stages = stages;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public StatusProject getStatusProject() {
        return statusProject;
    }

    public void setStatusProject(StatusProject statusProject) {
        this.statusProject = statusProject;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}
