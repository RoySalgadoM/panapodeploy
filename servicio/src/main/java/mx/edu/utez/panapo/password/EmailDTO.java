package mx.edu.utez.panapo.password;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class EmailDTO {
    @NotBlank
    @NotNull
    private String email;
    @NotBlank
    @NotNull
    private String fullname;
    @NotBlank
    @NotNull
    private String code;
    public EmailDTO() {
    }

    public EmailDTO(String email, String fullname, String code) {
        this.email = email;
        this.fullname = fullname;
        this.code = code;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
