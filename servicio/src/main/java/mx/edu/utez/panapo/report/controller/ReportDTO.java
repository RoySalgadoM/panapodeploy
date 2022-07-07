package mx.edu.utez.panapo.report.controller;

import mx.edu.utez.panapo.project.model.Project;


public class ReportDTO {
    private long id;
    private String phasePlanned;
    private String phaseReal;
    private String stagePlanned;
    private String stageReal;
    private int percentage;
    private String cost;
    private String daysDeviation;
    private String date;
    private Project project;


    public ReportDTO() {
    }

    public ReportDTO(long id, String phasePlanned, String phaseReal, String stagePlanned, String stageReal, int percentage, String cost, String daysDeviation, String date, Project project) {
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

    public ReportDTO(String phasePlanned, String phaseReal, String stagePlanned, String stageReal, int percentage, String cost, String daysDeviation, String date, Project project) {
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
}
