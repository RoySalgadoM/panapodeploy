package mx.edu.utez.panapo.type_client;

import mx.edu.utez.panapo.rol.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TypeClientRepository extends JpaRepository<TypeClient, Long> {

}
