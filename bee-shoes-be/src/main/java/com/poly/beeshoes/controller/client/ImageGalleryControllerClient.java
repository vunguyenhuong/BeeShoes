package com.poly.beeshoes.controller.client;

import com.poly.beeshoes.dto.request.ImageGalleryRequest;
import com.poly.beeshoes.util.CloudinaryUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/client/api/image-gallery")
public class ImageGalleryControllerClient {
    @Autowired
    private CloudinaryUtils cloudinaryUtils;

    @GetMapping("/{folderName}")
    public List<Map> getImagesInFolder(@PathVariable String folderName,
                                       @RequestParam(required = false, defaultValue = "50") Integer size) {
        return cloudinaryUtils.getImagesInFolder(folderName, size);
    }

    @PostMapping
    public String uploadImage(@ModelAttribute ImageGalleryRequest request) {
        List<String> url = cloudinaryUtils.uploadMultipleImages(request.getImages(), request.getFolder());
        if (url.isEmpty())
            return "Thất bại!";
        else
            return "Thêm thành công!";
    }
}
