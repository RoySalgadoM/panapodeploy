package mx.edu.utez.panapo.reportPhases.controller;

import mx.edu.utez.panapo.phases.Phases;
import mx.edu.utez.panapo.report.model.Report;

public class ReportPhasesDTO {
    private long id;
    private Phases phases;
    private Report report;
    private int porcentaje;

    public ReportPhasesDTO() {

    }

    public ReportPhasesDTO(long id, Phases phases, Report report, int porcentaje) {
        this.id = id;
        this.phases = phases;
        this.report = report;
        this.porcentaje = porcentaje;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Phases getPhases() {
        return phases;
    }

    public void setPhases(Phases phases) {
        this.phases = phases;
    }

    public Report getReport() {
        return report;
    }

    public void setReport(Report report) {
        this.report = report;
    }

    public int getPorcentaje() {
        return porcentaje;
    }

    public void setPorcentaje(int porcentaje) {
        this.porcentaje = porcentaje;
    }
}
