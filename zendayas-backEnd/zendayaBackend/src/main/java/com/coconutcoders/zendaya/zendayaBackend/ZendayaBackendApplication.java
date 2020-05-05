package com.coconutcoders.zendaya.zendayaBackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;

@SpringBootApplication
public class ZendayaBackendApplication {

	public static void main(String[] args) {

		//Getting the IP address
		try {
			URL url = new URL("http://checkip.amazonaws.com/");
			BufferedReader br = new BufferedReader(new InputStreamReader(url.openStream()));
			System.out.println("------------------------> " + br.readLine());
		} catch (Exception ignored) {}


		SpringApplication.run(ZendayaBackendApplication.class, args);
	}

}
