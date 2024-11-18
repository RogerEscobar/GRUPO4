package com.amadeus.extraours.repository;


import com.amadeus.extraours.model.User;
import com.amadeus.extraours.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u WHERE u.email = :emeailOrId OR u.id = :emailOrId")
    Optional<User> findByEmailOrId(@Param("emailOrId") String emailOrId);

    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationCode(String verificationCode);

    List<User> findByRole(UserRole role);
    boolean existsByEmail(String email);

//    Actualizar el código de verificación
    @Modifying
    @Query ("UPDATE User u SET u.verificationCode = :code, u.verificationCodeExpiry = :expiry WHERE u.id = :userId")
    void updateVerificationCode(
            @Param("userId") Long userId,
            @Param("code") String code,
            @Param("expiry")LocalDateTime expiry);

    @Query("SELECT u FROM User u WHERE u.verificationCodeExpiry < :now AND u.verificationCode IS NOT NULL")
    List<User> findUserWithExpiredVerificationCodes(@Param("now") LocalDateTime now);
}
