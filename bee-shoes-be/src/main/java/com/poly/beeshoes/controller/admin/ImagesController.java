package com.poly.beeshoes.controller.admin;

import com.poly.beeshoes.dto.response.ImageResponse;
import com.poly.beeshoes.entity.Images;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.repository.IImagesRepository;
import com.poly.beeshoes.repository.IShoeDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/images")
public class ImagesController {
    @Autowired
    private IImagesRepository imagesRepository;
    @Autowired
    private IShoeDetailRepository shoeDetailRepository;
    @GetMapping
    public ResponseObject create(@RequestParam String name, @RequestParam Long shoeDetail){
        Images images = new Images();
        images.setName(name);
        images.setShoeDetail(shoeDetailRepository.findById(shoeDetail).get());
        return new ResponseObject(imagesRepository.save(images));
    }

    @GetMapping("/{id}")
    public List<ImageResponse> getImagesByShoeDetail(@PathVariable Long id){
        return imagesRepository.getImagesByShoeDetail(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        imagesRepository.deleteById(id);
    }
}
