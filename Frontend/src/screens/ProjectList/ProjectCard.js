// screens/ProjectList/ProjectCard.js
import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProjectCard = ({ project, onPress }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        {project.thumbnail ? (
          <Image
            source={{ uri: project.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Icon name="home" size={48} color="#ccc" />
          </View>
        )}
        {project.isVR && (
          <View style={styles.vrBadge}>
            <Icon name="3d-rotation" size={16} color="#fff" />
            <Text style={styles.vrText}>VR</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {project.name}
          </Text>
          <View style={styles.statsContainer}>
            <Icon name="grid-view" size={16} color="#666" />
            <Text style={styles.statsText}>{project.roomCount} rooms</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detail}>
            <Icon name="access-time" size={14} color="#666" />
            <Text style={styles.detailText}>
              Modified {formatDate(project.lastModified)}
            </Text>
          </View>
          
          <View style={styles.detail}>
            <Icon name="straighten" size={14} color="#666" />
            <Text style={styles.detailText}>
              {project.dimensions.width}x{project.dimensions.length} m²
            </Text>
          </View>
        </View>

        {project.description && (
          <Text style={styles.description} numberOfLines={2}>
            {project.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  vrBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#2196F3',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  vrText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
});

export default ProjectCard;