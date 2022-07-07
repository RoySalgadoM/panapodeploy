package mx.edu.utez.panapo.reportPhases.model;

import mx.edu.utez.panapo.phases.Phases;
import mx.edu.utez.panapo.report.model.Report;

import javax.persistence.*;

@Entity
public class ReportPhases {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @ManyToOne
    @JoinColumn(name = "phases_id")
    private Phases phases;
    @ManyToOne
    @JoinColumn(name = "report_id")
    private Report report;
    private int porcentaje;

    public ReportPhases() {
    }

    public ReportPhases(Phases phases, Report report, int porcentaje) {
        this.phases = phases;
        this.report = report;
        this.porcentaje = porcentaje;
    }

    public ReportPhases(long id, Phases phases, Report report, int porcentaje) {
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
