import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import UIkit from 'uikit';

interface Attachment {
  id: number;
  path: string;
  path_compress: string;
  type: 'IMAGE' | 'FILE' | 'VOICE';
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-attachment-modal',
  templateUrl: './attachment-modal.component.html',
  styleUrls: ['./attachment-modal.component.css'],
})
export class AttachmentModalComponent implements OnInit {
  @Input() idTask!: number;
  @Input() attachments: Attachment[] = [];

  hasImageAttachments = false;
  hasFilesAttachments = false;

  ngOnInit(): void {
    this.updateAttachmentFlags();
  }

  updateAttachmentFlags(): void {
    this.hasImageAttachments = this.attachments.some(att => att.type === 'IMAGE');
    this.hasFilesAttachments = this.attachments.some(att => att.type !== 'IMAGE');
  }

  deleteAttachment(index: number): void {
    this.attachments = this.attachments.filter((_, i) => i !== index);
    this.updateAttachmentFlags();
  }

  deleteAttach(index: number): void {
    UIkit.modal.confirm('Are you sure you want to delete this attachment?').then(
      () => {
        this.deleteAttachment(index);
      },
      () => {
        console.log('Deletion cancelled.');
      }
    );
  }
}
