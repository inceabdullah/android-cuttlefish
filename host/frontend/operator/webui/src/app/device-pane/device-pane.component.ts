import {Component, OnInit} from '@angular/core';
import {Device} from '../device-interface';
import {DeviceService} from '../device.service';
import {DisplaysService} from '../displays.service';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-device-pane',
  templateUrl: './device-pane.component.html',
  styleUrls: ['./device-pane.component.sass'],
})
export class DevicePaneComponent implements OnInit {
  devices: Observable<Device[]> = of([]);
  deviceList: Device[] = [];

  constructor(
    private deviceService: DeviceService,
    private displaysService: DisplaysService
  ) {}

  ngOnInit(): void {
    this.getDevices();
  }

  onSelect(device: Device): void {
    if (device.isVisible === false) {
      this.displaysService.remove(device.id);
    } else {
      this.displaysService.add(device.id);
    }
  }

  onRefresh(): void {
    this.getDevices();
  }

  getDevices(): void {
    this.deviceService.getDevices().subscribe(info => {
      info.forEach(id => {
        if (
          !this.deviceList.some(device => {
            return device.id === id;
          })
        ) {
          this.deviceList.push({id: id, isVisible: false});
        }
      });
      this.devices = of(this.deviceList);
    });
  }

  showAll(): void {
    this.devices.subscribe(deviceArray => {
      deviceArray.forEach(device => {
        if (device.isVisible === false) {
          device.isVisible = true;
          this.onSelect(device);
        }
      });
    });
  }
}