package com.amadeus.extraours.config;


import com.amadeus.extraours.security.JwtAuthenticationFilter;
import com.amadeus.extraours.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * configuración de seguridad de la aplicación
 * Maneja autrización, autenticación y CORS
 */

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {


    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

//    Cadena de filtros de seguridad

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) //Se desahabilita por uso de tokens
                .cors(Customizer.withDefaults()) //Configuracion del cors
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Reglas de autorizacion para las rutas
                .authorizeHttpRequests(auth -> auth
//                Endpoints que serán públicos
                                .requestMatchers(
                                        "/api/auth/**",
                                        "/api/docs/**",
                                        "/swagger-ui/**"
                                ).permitAll()
//                 Endpoints exclusivos por rol
                                .requestMatchers(HttpMethod.GET, "/api/extrahours/**").hasAnyRole("EMPLEADO", "TEAM_LEADER", "MASTER")
                                .requestMatchers("/api/extrahours/approve/**").hasAnyRole("TEAM_LEADER", "MASTER")
                                .requestMatchers("/api/groups/**", "/api/reports/**").hasRole("MASTER")

//                 Endpoint autenticación
                                .anyRequest().authenticated()
                )

                // Añadir el filtro JWT antes de autenticacion estandar
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    //Crear el filtro JWT para procesat tokens

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(){
        return new JwtAuthenticationFilter(jwtService, userDetailsService);
    }

//    CORS para conectarse al front

    @Bean
    public CorsConfigurationSource corsConfigurationSource (){
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); //Conexion con vite
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(false); //Desabilita credenciales que no se necesitan en JWT

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
