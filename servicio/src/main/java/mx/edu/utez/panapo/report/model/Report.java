package mx.edu.utez.panapo.report.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import mx.edu.utez.panapo.phases.Phases;
import mx.edu.utez.panapo.project.model.Project;
import mx.edu.utez.panapo.reportPhases.model.ReportPhases;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Entity
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String phasePlanned;
    private String phaseReal;
    private String stagePlanned;
    private String stageReal;
    private int percentage;
    private String cost;
    private String daysDeviation;
    private String date;
    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    @OneToMany(mappedBy = "report")
    @JsonIgnore
    private List<ReportPhases> reportPhasesList;

    public Report() {

    }

    public Report(long id, String phasePlanned, String phaseReal, String stagePlanned, String stageReal, String cost, String daysDeviation, String date, int percentage, Project project) {
        this.id = id;
        this.phasePlanned = phasePlanned;
        this.phaseReal = phaseReal;
        this.stagePlanned = stagePlanned;
        this.stageReal = stageReal;
        this.percentage = percentage;
        this.cost = cost;
        this.daysDeviation = daysDeviation;
        this.date = date;
        this.project = project;
    }

    public Report(String phasePlanned, String phaseReal, String stagePlanned, String stageReal, String cost, String daysDeviation, String date, int percentage, Project project) {
        this.phasePlanned = phasePlanned;
        this.phaseReal = phaseReal;
        this.stagePlanned = stagePlanned;
        this.stageReal = stageReal;
        this.percentage = percentage;
        this.cost = cost;
        this.daysDeviation = daysDeviation;
        this.date = date;
        this.project = project;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getPhasePlanned() {
        return phasePlanned;
    }

    public void setPhasePlanned(String phasePlanned) {
        this.phasePlanned = phasePlanned;
    }

    public String getPhaseReal() {
        return phaseReal;
    }

    public void setPhaseReal(String phaseReal) {
        this.phaseReal = phaseReal;
    }

    public String getStagePlanned() {
        return stagePlanned;
    }

    public void setStagePlanned(String stagePlanned) {
        this.stagePlanned = stagePlanned;
    }

    public String getStageReal() {
        return stageReal;
    }

    public void setStageReal(String stageReal) {
        this.stageReal = stageReal;
    }

    public int getPercentage() {
        return percentage;
    }

    public void setPercentage(int percentage) {
        this.percentage = percentage;
    }

    public String getCost() {
        return cost;
    }

    public void setCost(String cost) {
        this.cost = cost;
    }

    public String getDaysDeviation() {
        return daysDeviation;
    }

    public void setDaysDeviation(String daysDeviation) {
        this.daysDeviation = daysDeviation;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public List<ReportPhases> getReportPhasesList() {
        return reportPhasesList;
    }

    public void setReportPhasesList(List<ReportPhases> reportPhasesList) {
        this.reportPhasesList = reportPhasesList;
    }
}
