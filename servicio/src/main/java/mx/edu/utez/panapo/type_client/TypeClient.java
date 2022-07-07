package mx.edu.utez.panapo.type_client;

import com.fasterxml.jackson.annotation.JsonIgnore;
import mx.edu.utez.panapo.client.model.Client;

import javax.persistence.*;
import java.util.List;

@Entity
public class TypeClient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false, unique = true)
    private String description;
    @OneToMany(mappedBy = "typeClient")
    @JsonIgnore
    private List<Client> clients;

    public TypeClient() {
    }

    public TypeClient(String description, List<Client> clients) {
        this.description = description;
        this.clients = clients;
    }

    public TypeClient(long id, String description) {
        this.id = id;
        this.description = description;
    }

    public TypeClient(long id, String description, List<Client> clients) {
        this.id = id;
        this.description = description;
        this.clients = clients;
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

    public List<Client> getClients() {
        return clients;
    }

    public void setClients(List<Client> clients) {
        this.clients = clients;
    }
}
